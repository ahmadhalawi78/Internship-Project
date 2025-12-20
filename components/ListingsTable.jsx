export default function ListingsTable({ listings, onReview }) {
  const getDateBadge = (date) => {
    if (date.toLowerCase() === 'today') {
      return <span className="badge badge-success">{date}</span>;
    } else if (date.toLowerCase() === 'yesterday') {
      return <span className="badge badge-warning">{date}</span>;
    } else {
      return <span className="badge badge-danger">{date}</span>;
    }
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Listing</th>
            <th>Reported By</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map(listing => (
            <tr key={listing.id}>
              <td>
                <strong>{listing.post}</strong>
                <div className="text-muted">Type: {listing.type}</div>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#6C757D',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {listing.user.charAt(0)}
                  </div>
                  {listing.user}
                </div>
              </td>
              <td>{getDateBadge(listing.date)}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onReview(listing.id)}
                >
                  <i className="fas fa-eye"></i> Review
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}