import { submitReview } from "@/app/actions/reviews";

export function ReviewForm({ requestId }: { requestId: string }) {
  return (
    <form action={submitReview} className="card grid gap-4 p-5">
      <input type="hidden" name="request_id" value={requestId} />
      <h3 className="text-lg font-bold">ให้คะแนนบริการครั้งนี้</h3>
      <div className="field">
        <label htmlFor="rating">คะแนน</label>
        <select id="rating" name="rating" className="select" required defaultValue="5">
          <option value="5">5 ดาว - ประทับใจมาก</option>
          <option value="4">4 ดาว - ดี</option>
          <option value="3">3 ดาว - พอใช้</option>
          <option value="2">2 ดาว - ควรปรับปรุง</option>
          <option value="1">1 ดาว - ไม่พอใจ</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="comment">ความคิดเห็น</label>
        <textarea id="comment" name="comment" className="textarea" placeholder="เล่าประสบการณ์สั้น ๆ" />
      </div>
      <button className="btn btn-primary">ส่งรีวิว</button>
    </form>
  );
}
