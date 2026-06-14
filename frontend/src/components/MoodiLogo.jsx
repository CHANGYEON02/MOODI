import logoImg from '../assets/moodi-logo.jpg';
import '../styles/logo.css';

export default function MoodiLogo() {
  return (
    <div className="moodi-logo">
      <img
        src={logoImg}
        alt="MooDI 로고"
        className="moodi-logo__img"
        draggable={false}
      />
      <p className="moodi-logo__subtitle">감정으로 찾는 나만의 음악</p>
    </div>
  );
}
