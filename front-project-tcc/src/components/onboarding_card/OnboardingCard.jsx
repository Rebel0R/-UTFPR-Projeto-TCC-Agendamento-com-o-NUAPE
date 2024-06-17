import ProgressOnboarding from "./progress_onboarding/ProgressOnboarding";
import style from "./style.module.css";

export default function OnboardingCard({
  link_img,
  title,
  description,
  progress,
}) {
  return (
    <div className={style.onboardingContainer}>
      <img
        src={link_img}
        alt="Imagem referente ao onboarding"
        className={style.onboardingImg}
      />
      <div className={style.onboardingContent}>
        <div className={style.onboardingText}>
          <p className={style.onboardingTitle}>{title}</p>
          <p className={style.onboardingDescription}>{description}</p>
        </div>
        <ProgressOnboarding progress={progress} />
      </div>
    </div>
  );
}
