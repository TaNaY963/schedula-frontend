import { redirect } from "next/navigation";

export default function DoctorRegisterRedirectPage() {
  redirect("/register?role=doctor");
}
