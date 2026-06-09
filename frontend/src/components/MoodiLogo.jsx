import '../styles/logo.css';

export default function MoodiLogo() {
  return (
    <div className="moodi-logo">
      <div className="moodi-logo__circle">
        <span className="moodi-logo__note moodi-logo__note--1">♪</span>
        <span className="moodi-logo__note moodi-logo__note--2">♫</span>
        <span className="moodi-logo__note moodi-logo__note--3">♩</span>
        <span className="moodi-logo__text">MooDI</span>
      </div>
      <p className="moodi-logo__subtitle">감정으로 찾는 나만의 음악</p>
    </div>
  );
}
