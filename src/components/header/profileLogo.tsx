import React from  'react';

// import logo
import profileSvg from '../../assets//svg/profile.svg';

const ProfileLogo = () => {
  return (
    <div className="header-profile">
      <img src={profileSvg} alt='' />
      <span className="header-profile__username">Пользователь</span>
    </div>
  );
}

export default ProfileLogo;
