function LoadingSkeleton() {
  return (
    <div className="skeleton-stack" aria-busy="true" aria-label="Loading rooms">
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton-row">
          <div className="skeleton-block skeleton-title" />
          <div className="skeleton-block skeleton-meta" />
          <div className="skeleton-block skeleton-chip" />
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
