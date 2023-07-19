import { LoginMethod } from "./AuthProvider";

export default function LoginView() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary text-center text-white">
      로그인이 필요한 페이지입니다.
      <br />
      로그인 창이 뜨지 않으면 새로고침 해 주세요.
    </div>
  );
}
