import {
  DetailCard,
  DetailField,
  DetailSection,
} from "@/components/detail-card";

// Empty fields render "—", as in the design.
export type BookingInformationData = {
  requesterName?: string;
  location?: string;
  date?: string;
  time?: string;
  requesterType?: string;
  purpose?: string;
  organizationName?: string;
  projectCode?: string;
  dateTime?: string;
  namePrefix?: string;
  studentId?: string;
  yearLevel?: string;
  department?: string;
  group?: string;
  phone?: string;
  email?: string;
  lineId?: string;
  englishName?: string;
  otherDetails?: string;
};

// designs/components/Booking information.svg
export function BookingInformation({ data }: { data: BookingInformationData }) {
  return (
    <DetailCard title="รายละเอียดการจอง">
      <DetailSection>
        <DetailField label="ชื่อผู้จอง">{data.requesterName}</DetailField>
        <DetailField label="สถานที่">{data.location}</DetailField>
      </DetailSection>
      <DetailSection>
        <DetailField label="วันที่ใช้งาน">{data.date}</DetailField>
        <DetailField label="เวลาที่ใช้งาน">{data.time}</DetailField>
      </DetailSection>
      <DetailSection title="รายละเอียดเพิ่มเติม">
        <DetailField label="ประเภทผู้จอง">{data.requesterType}</DetailField>
        <DetailField label="วัตถุประสงค์ในการใช้">{data.purpose}</DetailField>
        <DetailField label="ชื่อหน่วยงาน/โครงการ">
          {data.organizationName}
        </DetailField>
        <DetailField label="รหัสโครงการ (ถ้ามี)">
          {data.projectCode}
        </DetailField>
        <DetailField label="สถานที่">{data.location}</DetailField>
        <DetailField label="วัน-เวลา">{data.dateTime}</DetailField>
      </DetailSection>
      <DetailSection title="ข้อมูลผู้จอง">
        <DetailField label="คำนำหน้า">{data.namePrefix}</DetailField>
        <DetailField label="ชื่อ นามสกุล">{data.requesterName}</DetailField>
        <DetailField label="รหัสนิสิต">{data.studentId}</DetailField>
        <DetailField label="ชั้นปี">{data.yearLevel}</DetailField>
        <DetailField label="ภาค (Department)">{data.department}</DetailField>
        <DetailField label="กรุ๊ป (Group)">{data.group}</DetailField>
        <DetailField label="เบอร์โทรศัพท์">{data.phone}</DetailField>
        <DetailField label="email">{data.email}</DetailField>
        <DetailField label="ID Line (ถ้ามี)">{data.lineId}</DetailField>
        <DetailField label="ชื่อ - นามสกุล (ภาษาอังกฤษ)">
          {data.englishName}
        </DetailField>
      </DetailSection>
      <DetailSection title="รายละเอียดอื่น ๆ">
        <DetailField label="รายละเอียดอื่น ๆ" wide>
          {data.otherDetails}
        </DetailField>
      </DetailSection>
    </DetailCard>
  );
}
