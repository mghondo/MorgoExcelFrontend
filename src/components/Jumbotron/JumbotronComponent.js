import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./JumbotronComponent.css";

const JumbotronComponent = ({
  title = "Morgo Tools",
  showSlogan = true, // New prop to control slogan visibility
}) => {
  const [showZach, setShowZach] = useState(false);

  useEffect(() => {
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), 8, 21); // August is month 7 (0-based index)
    targetDate.setHours(0, 0, 0, 0); // Set to 12 AM

    if (now < targetDate) {
      // Only show "except for Zach" if current date is before target date
      const timer = setTimeout(() => {
        setShowZach(true);
      }, 3000);

      const timeUntilTarget = targetDate - now;
      const hideTimer = setTimeout(() => {
        setShowZach(false);
      }, timeUntilTarget);

      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, []);

  return (
    <div className="jumbotron jumbotron-fluid jumbotron-custom">
      <div className="container-fluid text-center">
        <h1 className="display-4">{title}</h1>
        {showSlogan && (
          <h4>
            Making the day faster.
            {/* {showZach && ".....except for Zach!!"} */}
          </h4>
        )}
      </div>
    </div>
  );
};

export default JumbotronComponent;

