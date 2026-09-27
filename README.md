# Care Companion

แพลตฟอร์มกลางสำหรับเชื่อม **ผู้ที่ต้องการผู้ช่วยร่วมเดินทาง (Customer)** กับ **ผู้ให้บริการร่วมเดินทาง (Companion)**

ผู้ช่วยมีหน้าที่ช่วยเหลือและอำนวยความสะดวกในการเดินทางและการทำธุระเท่านั้น **ไม่ใช่ผู้ให้บริการทางการแพทย์หรือผู้ดูแลรักษาผู้ป่วย**

จัดทำตาม Assignment+Midterm พัฒนา Web Application by Next.js

## Tech Stack

- Next.js + Tailwind CSS
- Google Account ผ่าน Supabase Authentication
- Supabase PostgreSQL
- Supabase Storage
- Deploy บน Vercel

## บทบาทผู้ใช้

- **Guest**: ดูข้อมูลแพลตฟอร์ม ผู้ช่วยที่อนุมัติแล้ว และวิธีใช้งาน
- **Customer**: สร้างคำขอ ระบุประเภทธุระ วัน เวลา สถานที่ต้นทาง จุดหมาย ระยะเวลา และรายละเอียด แล้วค้นหาหรือเลือก Companion
- **Companion**: กรอกประสบการณ์ ความสามารถ พื้นที่ ช่วงเวลาที่สะดวก เสนอตัว และตอบรับงาน
- **Admin**: ดูแดชบอร์ดภาพรวม จัดการผู้ใช้ ตรวจสอบ Companion และจัดการคำขอ

## วงจรการใช้บริการ

1. เข้าสู่ระบบด้วย Google
2. เลือกบทบาทและกรอกโปรไฟล์
3. Customer สร้างคำขอแบบเปิดรับ หรือส่งคำขอถึง Companion โดยตรง
4. Companion สมัครงานหรือตอบรับคำขอ
5. เริ่มให้บริการ และปิดงานเมื่อเสร็จ
6. ให้คะแนนหลังบริการเสร็จสิ้น

## Business Rules

- ต้องล็อกอินด้วย Google ทั้ง Customer และ Companion
- Companion ต้องรอ Admin อนุมัติก่อนจึงจะโชว์ในหน้าค้นหาและสมัครงานได้
- เบอร์โทรของอีกฝ่ายจะแสดงหลังงานถูกตอบรับ
- รีวิวได้เฉพาะงานที่สถานะเสร็จสิ้น
- Admin สามารถเปลี่ยนบทบาท ระงับบัญชี และปรับสถานะคำขอได้
- ระบบไม่รองรับการรักษาพยาบาล

## โครงสร้างฐานข้อมูล

```text
auth.users
    └── profiles (role: customer | companion | admin)
            ├── companion_profiles
            ├── service_requests (customer_id, companion_id)
            │       ├── applications
            │       └── reviews
            └── storage: avatars, documents
```

## เริ่มต้นใช้งาน

### 1) ติดตั้งโปรเจกต์

```bash
cd care-companion
npm install
copy .env.example .env.local
```

### 2) สร้างโปรเจกต์ Supabase

1. เปิด [https://supabase.com](https://supabase.com) แล้วสร้างโปรเจกต์ใหม่
2. ไปที่ **Project Settings > API** แล้วคัดลอก
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. เปิด **SQL Editor** วางไฟล์ `supabase/schema.sql` ทั้งไฟล์ แล้วกด Run

### 3) เปิด Google Login

1. สร้าง OAuth Client ใน Google Cloud Console แบบ Web
2. ใส่ Authorized redirect URI ของ Supabase:
   `https://<project-ref>.supabase.co/auth/v1/callback`
3. ใน Supabase ไปที่ **Authentication > Providers > Google** แล้วใส่ Client ID / Secret
4. เพิ่ม Redirect URLs ของเว็บ:
   - `http://localhost:3000/auth/callback`
   - `https://<your-vercel-domain>/auth/callback`

### 4) ตั้ง Admin คนแรก

หลังล็อกอินด้วย Google ครั้งแรก ให้รัน SQL นี้ใน Supabase:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'your-email@gmail.com');
```

### 5) รันเครื่องตัวเอง

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

## Deploy ขึ้น Vercel

1. push โปรเจกต์ขึ้น GitHub
2. Import โปรเจกต์ใน [Vercel](https://vercel.com)
3. ใส่ Environment Variables ชุดเดียวกับ `.env.local`
4. ตั้ง `NEXT_PUBLIC_SITE_URL` เป็นโดเมน Vercel
5. Deploy แล้วเพิ่มโดเมนนั้นใน Supabase Redirect URLs

## บัญชีสำหรับเดโมในชั้นเรียน

สร้างอย่างน้อย 3 บัญชี Google:

1. Admin
2. Customer
3. Companion แล้วให้ Admin อนุมัติในหน้า `/admin/companions`

## โฟลเดอร์สำคัญ

- `src/app` หน้าเว็บและ route ตามบทบาท
- `src/app/actions` server actions สำหรับสร้างคำขอ ตอบรับ รีวิว และงานแอดมิน
- `src/lib/supabase` client / server / middleware ของ Supabase
- `supabase/schema.sql` ตาราง, RLS, Storage และ trigger สร้างโปรไฟล์อัตโนมัติ
