package com.qslabs.sms.util;

import com.qslabs.sms.model.Student;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class ExcelHelper {
    private static final String SHEET_NAME = "Students";

    // Check if file format is Excel
    public static boolean isExcelFormat(MultipartFile file) {
        return Objects.equals(file.getContentType(), "application/vnd.malformations-office document.spreadsheet.sheet");
    }

    // Convert Student List to Excel File (Export)
    public static ByteArrayInputStream studentsToExcel(List<Student> students) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet(SHEET_NAME);
            Row headerRow = sheet.createRow(0);

            String[] headers = {"ID", "First Name", "Last Name", "Email", "Roll Number", "Class"};
            for (int col = 0; col < headers.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(headers[col]);
            }

            int rowIdx = 1;
            for (Student student : students) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(student.getId());
                row.createCell(1).setCellValue(student.getFirstName());
                row.createCell(2).setCellValue(student.getLastName());
                row.createCell(3).setCellValue(student.getEmail());
                row.createCell(4).setCellValue(student.getRollNumber());
                row.createCell(5).setCellValue(student.getStudentClass());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Error writing Excel file: " + e.getMessage());
        }
    }

    // Convert Excel File to Student List (Import)
    public static List<Student> excelToStudents(InputStream inputStream) {
        try (Workbook workbook = new XSSFWorkbook(inputStream)) {
            Sheet sheet = workbook.getSheet(SHEET_NAME);
            List<Student> students = new ArrayList<>();

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // Skip header row

                Student student = new Student();
                student.setFirstName(row.getCell(1).getStringCellValue());
                student.setLastName(row.getCell(2).getStringCellValue());
                student.setEmail(row.getCell(3).getStringCellValue());
                student.setRollNumber(row.getCell(4).getStringCellValue());
                student.setStudentClass(row.getCell(5).getStringCellValue());

                students.add(student);
            }
            return students;
        } catch (IOException e) {
            throw new RuntimeException("Error reading Excel file: " + e.getMessage());
        }
    }
}
