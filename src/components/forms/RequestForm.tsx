import { createRequest } from "@/app/actions/requests";
import { ERRAND_TYPES } from "@/lib/constants";

export function RequestForm({ companionId }: { companionId?: string }) {
  return (
    <form action={createRequest} className="card grid gap-5 p-6">
      {companionId ? <input type="hidden" name="companion_id" value={companionId} /> : null}

      <div className="field">
        <label htmlFor="errand_type">ประเภทธุระ</label>
        <select id="errand_type" name="errand_type" className="select" required>
          {ERRAND_TYPES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="title">หัวข้อคำขอ</label>
        <input
          id="title"
          name="title"
          className="input"
          required
          placeholder="เช่น พาไปโรงพยาบาลตามนัดเช้าวันจันทร์"
        />
      </div>

      <div className="field">
        <label htmlFor="description">รายละเอียด</label>
        <textarea
          id="description"
          name="description"
          className="textarea"
          placeholder="บอกสิ่งที่ต้องการความช่วยเหลือ เช่น ช่วยถือของ กรอกเอกสาร หรือพูดคุยระหว่างเดินทาง"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="field">
          <label htmlFor="origin">สถานที่ต้นทาง</label>
          <input id="origin" name="origin" className="input" required placeholder="บ้าน / คอนโด / จุดนัดพบ" />
        </div>
        <div className="field">
          <label htmlFor="destination">จุดหมาย</label>
          <input id="destination" name="destination" className="input" required placeholder="โรงพยาบาล ธนาคาร หรือหน่วยงาน" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="field">
          <label htmlFor="scheduled_date">วันที่ต้องการใช้บริการ</label>
          <input id="scheduled_date" name="scheduled_date" type="date" className="input" required />
        </div>
        <div className="field">
          <label htmlFor="scheduled_time">เวลา</label>
          <input id="scheduled_time" name="scheduled_time" type="time" className="input" required />
        </div>
        <div className="field">
          <label htmlFor="duration_hours">ระยะเวลา (ชั่วโมง)</label>
          <input
            id="duration_hours"
            name="duration_hours"
            type="number"
            min="1"
            step="0.5"
            defaultValue="2"
            className="input"
            required
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="notes">หมายเหตุเพิ่มเติม</label>
        <textarea id="notes" name="notes" className="textarea" placeholder="เช่น ต้องมีรถนั่ง หรือต้องการผู้ช่วยผู้หญิง" />
      </div>

      <button className="btn btn-primary text-lg">
        {companionId ? "ส่งคำขอถึงผู้ช่วยคนนี้" : "สร้างคำขอและเปิดรับผู้ช่วย"}
      </button>
    </form>
  );
}
