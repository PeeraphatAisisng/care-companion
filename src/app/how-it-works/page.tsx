export default function HowItWorksPage() {
  const steps = [
    {
      title: "เข้าชมข้อมูลได้โดยไม่ต้องล็อกอิน",
      body: "ทุกคนสามารถดูข้อมูลแพลตฟอร์ม ผู้ช่วยที่ได้รับการยืนยัน และประเภทธุระที่รองรับได้",
    },
    {
      title: "เข้าสู่ระบบด้วย Google",
      body: "ทั้ง Customer และ Companion ใช้บัญชี Google แล้วเลือกบทบาท พร้อมกรอกข้อมูลที่จำเป็น",
    },
    {
      title: "ลูกค้าระบุความต้องการ",
      body: "เลือกประเภทธุระ วัน เวลา สถานที่ต้นทาง จุดหมาย ระยะเวลา และรายละเอียด แล้วเปิดรับผู้ช่วยหรือส่งคำขอถึงคนที่เลือก",
    },
    {
      title: "ผู้ช่วยนำเสนอตัวเองและตอบรับงาน",
      body: "ผู้ช่วยกรอกประสบการณ์ ความสามารถ พื้นที่ ช่วงเวลาสะดวก และเสนอตัวหรือตอบรับคำขอโดยตรง",
    },
    {
      title: "ให้บริการจนเสร็จสิ้น",
      body: "เมื่อตอบรับแล้วสามารถเริ่มงาน ปิดงาน และให้คะแนนได้ แอดมินดูแลภาพรวมและความปลอดภัยของข้อมูล",
    },
  ];

  return (
    <div className="page-wrap py-12">
      <h1 className="text-4xl font-bold">วิธีใช้งาน Care Companion</h1>
      <p className="mt-3 max-w-3xl text-lg text-muted">
        ระบบออกแบบมาให้ครบวงจรตั้งแต่ค้นหา ร้องขอ ตอบรับ ให้บริการ จนปิดงาน
        โดยผู้ช่วยมีหน้าที่อำนวยความสะดวกในการเดินทางเท่านั้น
      </p>
      <div className="mt-8 grid gap-4">
        {steps.map((step, index) => (
          <article key={step.title} className="card p-6">
            <p className="chip bg-teal-soft text-teal">ขั้นตอนที่ {index + 1}</p>
            <h2 className="mt-3 text-2xl font-bold">{step.title}</h2>
            <p className="mt-2 text-lg text-muted">{step.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
