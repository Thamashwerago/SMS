import React, { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Card from "../../components/common/Card";
import CommonButton from "../../components/common/Button";
import courseService from "../../services/courseService";
import userService, { User } from "../../services/userService";
import {
  COURSE_STRINGS
} from "../../constants/admin/courseConsts";

/**
 * Form data shape, now including assignments
 */
interface CourseFormData {
  code: string;
  name: string;
  credits: string;
  duration: string;
  description: string;
  teacherId: number;
  studentIds: number[];
}

const AddCourse: React.FC = () => {
  const navigate = useNavigate();

  // Form state with assignment fields
  const [formData, setFormData] = useState<CourseFormData>({
    code: "",
    name: "",
    credits: "",
    duration: "",
    description: "",
    teacherId: 0,
    studentIds: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // User lists for assignments
  const [teachers, setTeachers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const all = await userService.getAll();
        setTeachers(all.filter(u => u.role === 'Teacher'));
        setStudents(all.filter(u => u.role === 'Student'));
      } catch (e) {
        console.error('Failed to load users', e);
      }
    })();
  }, []);

  const handleBack = () => navigate(-1);
  const handleClear = () => {
    setFormData({ code: "", name: "", credits: "", duration: "", description: "", teacherId: 0, studentIds: [] });
    setError(null);
    setSuccess(null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, multiple, selectedOptions } = e.target as HTMLSelectElement;
    if (multiple) {
      const vals = Array.from(selectedOptions).map(o => Number(o.value));
      setFormData(prev => ({ ...prev, [name]: vals } as typeof prev));
    } else if (name === 'teacherId') {
      setFormData(prev => ({ ...prev, teacherId: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setError(null);
    setSuccess(null);
  };

  const validateForm = () => {
    const { code, name, credits, duration, description, teacherId } = formData;
    if (!code || !name || !credits || !duration || !description || !teacherId) {
      setError(COURSE_STRINGS.ERROR_VALIDATION);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await courseService.create({
        code: formData.code,
        name: formData.name,
        credits: Number(formData.credits),
        duration: Number(formData.duration),
        description: formData.description,
        // Use the correct property name that matches the Course type
        students: formData.studentIds,
      });
      setSuccess(COURSE_STRINGS.SUCCESS_ADD);
      handleClear();
      setTimeout(() => navigate('/admin/course-management'), 1500);
    } catch (e) {
      console.error('Error creating course:', e);
      setError(COURSE_STRINGS.ERROR_ADD);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-roboto bg-gradient-to-br from-gray-900 to-black text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8 relative">
          {/* Back Button */}
          <CommonButton
            label="Back"
            variant="secondary"
            size="sm"
            icon={<ArrowLeft />}
            onClick={handleBack}
            className="absolute top-8 right-8"
          />

          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
            {COURSE_STRINGS.PAGE_HEADING}
          </h1>

          <Card title="New Course" value="" icon="➕" className="mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Code & Name */}
                <div>
                  <label className="block mb-2 font-semibold">{COURSE_STRINGS.LABEL_CODE}</label>
                  <input
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder={COURSE_STRINGS.PLACEHOLDER_CODE}
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">{COURSE_STRINGS.LABEL_NAME}</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={COURSE_STRINGS.PLACEHOLDER_NAME}
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:outline-none text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Credits & Duration */}
                <div>
                  <label className="block mb-2 font-semibold">{COURSE_STRINGS.LABEL_CREDITS}</label>
                  <input
                    name="credits"
                    type="number" min="0"
                    value={formData.credits}
                    onChange={handleChange}
                    placeholder={COURSE_STRINGS.PLACEHOLDER_CREDITS}
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">{COURSE_STRINGS.LABEL_DURATION}</label>
                  <input
                    name="duration"
                    type="number" min="0"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder={COURSE_STRINGS.PLACEHOLDER_DURATION}
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:outline-none text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-semibold">{COURSE_STRINGS.LABEL_DESCRIPTION}</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={COURSE_STRINGS.PLACEHOLDER_DESCRIPTION}
                  className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:outline-none text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Teacher assignment */}
                <div>
                  <label htmlFor="teacherSelect" className="block mb-2 font-semibold">Assign Teacher</label>
                  <select
                    id="teacherSelect"
                    name="teacherId"
                    value={formData.teacherId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:outline-none text-white"
                    required
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map(t => <option key={t.id} value={t.id}>{t.username}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="studentsSelect" className="block mb-2 font-semibold">Assign Students</label>
                  <select
                    id="studentsSelect"
                    name="studentIds" multiple
                    value={formData.studentIds.map(String)}
                    onChange={handleChange}
                    className="w-full h-32 px-4 py-2 bg-gray-800 border border-indigo-500 rounded-md focus:outline-none text-white"
                  >
                    {students.map(s => <option key={s.id} value={s.id}>{s.username}</option>)}
                  </select>
                </div>
              </div>

              {/* Form actions */}
              <div className="flex space-x-4">
                <CommonButton
                  label="Clear"
                  variant="secondary" size="md" icon={<X />}
                  onClick={handleClear} disabled={loading}
                />
                <CommonButton
                  variant="primary" size="md" label={COURSE_STRINGS.BUTTON_SUBMIT}
                  isLoading={loading}
                />
              </div>
            </form>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AddCourse;