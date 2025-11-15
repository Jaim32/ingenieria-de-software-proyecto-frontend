import React from 'react';
import Button from '../../components/ui/Button';
import hoja from '../../../public/images/hoja.svg';
import gota from '../../../public/images/gota.svg';
import luna from '../../../public/images/luna.svg';
import styles from '../../styles/WellnessJourney.module.css';
import { useNavigate } from 'react-router-dom';

export default function WellnessJourneyLandingPage() {
  const navigate = useNavigate();
  const handleBeginJourney = () => navigate('/questionaire');
   const handleLogin = () => {
    navigate('/authentication-flow-interface?tab=login');
  };

  return (
    <div className={styles.gradientWrapper}>
      {/* FIGURAS DECORATIVAS */}
      <div className={styles.circleYellow} />
      <div className={styles.circleGreen}  />
      <div className={styles.circleBlue}   />
      <div className={styles.borderCircle1}/>
      <div className={styles.borderCircle2}/>
      <div className={styles.borderCircle3}/>

      {/* CONTENIDO PRINCIPAL (CENTRADO) */}
      <div className={styles.mainContent}>
        {/* ÍCONOS “ESPARCIDOS” */}
        <div className={styles.icons}>
          <img src={hoja} alt="leaf"  className={styles.iconLeaf} />
          <img src={gota} alt="drop"  className={styles.iconDrop} />
          <img src={luna} alt="moon"  className={styles.iconMoon} />
        </div>

        {/* TITULAR MULTILÍNEA */}
        <h1 className={styles.title}>
          Your Journey to <span className={styles.highlight}>Wellness</span><br />
          Begins Here
        </h1>
      </div>

      {/* BOTONES FIJOS AL FONDO */}
      <div className={styles.buttonWrapper}>
        <Button
  onClick={handleBeginJourney}
  className={styles.btnPrimary}
>
  Begin Your Journey
</Button>

<Button
  onClick={handleLogin}
  className={styles.btnSecondary}
>
  Login
</Button>
      </div>
    </div>
  );
}
