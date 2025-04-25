// src/pages/Admin/AdminProfile.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Common UI components
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Card from "../../components/common/Card";
import CommonTable from "../../components/common/Table";
import Chart from "../../components/common/Chart";
import Button from "../../components/common/Button";

// Service and validation import
import userService, { User } from "../../services/userService";
import { validateProfileForm, ProfileFormData } from "../../utils/validation";

// String constants
import { PROFILE_STRINGS } from "../../constants/admin/profileConsts";

// Type for table rows
type TableRow = {
  id: number;
  field: string;
  value: string | number;
};

const AdminProfile: React.FC = () => {
  const navigate = useNavigate();

  /** State: Profile data fetched from API */
  const [profile, setProfile] = useState<User | null>(null);

  /** State: Form data for editing */
  const [formData, setFormData] = useState<ProfileFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  /** State: Loading & messaging */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * fetchProfile
   * ------------
   * Retrieves the admin profile using the stored userId.
   * Handles missing userId and API errors separately.
   */
  const fetchProfile = useCallback(async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Retrieve userId from session
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      setError(PROFILE_STRINGS.ERROR_NO_USER_ID);
      setLoading(false);
      return;
    }

    try {
      const data = await userService.getById(userId);
      setProfile(data);
      // Pre-fill form fields (except passwords)
      setFormData({
        username: data.username,
        email: data.email,
        password: "",
        confirmPassword: "",
      });
      setSuccess(PROFILE_STRINGS.SUCCESS_FETCH);
    } catch (apiErr: unknown) {
      console.error(PROFILE_STRINGS.EXC_FETCH, apiErr);
      setError(PROFILE_STRINGS.ERROR_FETCH);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  /**
   * handleChange
   * ------------
   * Updates form state on input change.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * handleSave
   * ----------
   * Validates and submits updated profile data.
   * Uses separate try–catch for validation and API call.
   */
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // 1. Validation
    const validationErrors = validateProfileForm(formData);
    if (validationErrors.length) {
      setError(PROFILE_STRINGS.EXC_UPDATE + validationErrors.join(" "));
      return;
    }

    if (!profile) return;

    setLoading(true);
    try {
      // 2. API call: update
      await userService.update(profile.id, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      setSuccess(PROFILE_STRINGS.SUCCESS_UPDATE);

      // 3. Refresh profile display
      setTimeout(fetchProfile, PROFILE_STRINGS.NAVIGATE_DELAY_MS);
    } catch (apiErr: unknown) {
      console.error(PROFILE_STRINGS.EXC_UPDATE, apiErr);
      setError(PROFILE_STRINGS.ERROR_UPDATE);
    } finally {
      setLoading(false);
    }
  };

  /** Prepare table rows for profile summary */
  const tableData: TableRow[] = useMemo(() => {
    if (!profile) return [];
    return [
      { id: 1, field: PROFILE_STRINGS.LABEL_ID, value: profile.id },
      {
        id: 2,
        field: PROFILE_STRINGS.LABEL_USERNAME,
        value: profile.username,
      },
      {
        id: 3,
        field: PROFILE_STRINGS.LABEL_EMAIL,
        value: profile.email,
      },
      {
        id: 4,
        field: PROFILE_STRINGS.LABEL_ROLE,
        value: profile.role,
      },
    ];
  }, [profile]);

  /** Placeholder chart data for activity (to replace with real API) */
  const activityData = useMemo(
    () => ({
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      views: [5, 8, 3, 6, 7, 4, 9],
    }),
    []
  );

  /** Chart configuration */
  const chartData = useMemo(
    () => ({
      labels: activityData.labels,
      datasets: [
        {
          label: PROFILE_STRINGS.ACTIVITY_CHART_LABEL,
          data: activityData.views,
          borderColor: "rgba(0,230,255,0.8)",
          backgroundColor: "rgba(0,230,255,0.2)",
          tension: 0.4,
        },
      ],
    }),
    [activityData]
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: {
          position: "top" as const,
          labels: { color: "white" },
        },
        title: {
          display: true,
          text: PROFILE_STRINGS.ACTIVITY_CHART_TITLE,
          color: "white",
        },
      },
      scales: {
        x: {
          ticks: { color: "white" },
          grid: { color: "rgba(255,255,255,0.1)" },
        },
        y: {
          ticks: { color: "white" },
          grid: { color: "rgba(255,255,255,0.1)" },
        },
      },
    }),
    []
  );

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black">
      {/* Sidebar */}
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col overflow-x-hidden">
        {/* Navbar */}
        <Navbar />
        <main className="flex-1 p-8 overflow-x-auto">
          {/* Heading */}
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
            {PROFILE_STRINGS.PAGE_HEADING}
          </h1>

          {/* Refresh & Save Buttons */}
          <div className="flex justify-end space-x-3 mb-6">
            <Button
              label={PROFILE_STRINGS.BUTTON_REFRESH}
              onClick={fetchProfile}
              isLoading={loading}
              variant="secondary"
            />
          </div>

          {/* Error / Success */}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}

          {/* Profile Summary Card */}
          {profile && (
            <Card
              title={profile.username}
              value={profile.email}
              icon="👤"
              className="mb-8"
            >
              <p className="text-gray-400">Role: {profile.role}</p>
            </Card>
          )}

          {/* Profile Details Table */}
          {tableData.length ? (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                {PROFILE_STRINGS.PAGE_HEADING} Details
              </h2>
              <CommonTable
                columns={[
                  {
                    header: PROFILE_STRINGS.LABEL_FIELD,
                    accessor: (r: TableRow) => r.field,
                  },
                  {
                    header: PROFILE_STRINGS.LABEL_VALUE,
                    accessor: (r: TableRow) => r.value,
                  },
                ]}
                data={tableData}
                onRowClick={() => {}}
              />
            </section>
          ) : (
            <p className="text-white">{PROFILE_STRINGS.NO_DATA}</p>
          )}

          {/* Profile Activity Chart */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              {PROFILE_STRINGS.ACTIVITY_CHART_TITLE}
            </h2>
            <div className="bg-black bg-opacity-50 border border-indigo-500 p-6 rounded-xl shadow-xl">
              <Chart type="line" data={chartData} options={chartOptions} />
            </div>
          </section>

          {/* Edit Profile Form */}
          {profile && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                {PROFILE_STRINGS.EDIT_HEADING}
              </h2>
              <form
                onSubmit={handleSave}
                className="bg-black bg-opacity-50 border border-indigo-500 rounded-xl shadow-xl p-8 max-w-xl"
              >
                {/* Username */}
                <div className="mb-4">
                  <label
                    htmlFor="username"
                    className="block text-white font-semibold mb-2"
                  >
                    {PROFILE_STRINGS.LABEL_USERNAME}
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder={PROFILE_STRINGS.PLACEHOLDER_USERNAME}
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-white font-semibold mb-2"
                  >
                    {PROFILE_STRINGS.LABEL_EMAIL}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={PROFILE_STRINGS.PLACEHOLDER_EMAIL}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-white font-semibold mb-2"
                  >
                    {PROFILE_STRINGS.LABEL_PASSWORD}
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder={PROFILE_STRINGS.PLACEHOLDER_PASSWORD}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-white font-semibold mb-2"
                  >
                    {PROFILE_STRINGS.LABEL_CONFIRM_PASSWORD}
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder={PROFILE_STRINGS.PLACEHOLDER_CONFIRM_PASSWORD}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Save & Cancel Buttons */}
                <div className="flex justify-end space-x-4">
                  <Button
                    label={PROFILE_STRINGS.BUTTON_CANCEL}
                    variant="secondary"
                    onClick={() => navigate(-1)}
                  />
                  <Button
                    label={PROFILE_STRINGS.BUTTON_SAVE}
                    type="submit"
                    isLoading={loading}
                    variant="primary"
                  />
                </div>
              </form>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminProfile;
