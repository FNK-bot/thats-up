

const Fab = () => {
  return (
    <div className="fab">
      {/* a focusable div with tabIndex is necessary to work on all browsers. role="button" is necessary for accessibility */}
      <div
        tabIndex={0}
        role="button"
        className="btn btn-lg btn-circle btn-primary"
      >
        F
      </div>

      {/* buttons that show up when FAB is open */}
      <button className="btn btn-lg btn-circle">A</button>
      <button className="btn btn-lg btn-circle">B</button>
      <button className="btn btn-lg btn-circle">C</button>
    </div>
  );
}

export default Fab