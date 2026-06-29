import React from 'react';

function TrustDashboard() {
  // Built to mirror the ledger validation rules requested in Screen 5 [cite: 58]
  const clearLedgerData = [
    {
      id: "#TXN-98401",
      details: "Sony Alpha Camera Kit",
      party: "Rajesh Kumar (Owner)",
      amount: "₹3,800",
      status: "Funds Released",
      class: "released"
    },
    {
      id: "#TXN-98522",
      details: "Gear Sports Mountain Bicycle",
      party: "Saravanan R. (Renter)",
      amount: "₹1,800",
      status: "Under Dispute Appraisal",
      class: "dispute"
    },
    {
      id: "#TXN-98522",
      details: "LAPTOP",
      party: "Saravanan R. (Renter)",
      amount: "₹1,800",
      status: "Under Dispute Appraisal",
    }
    

  ];

  return (
    <div className="dashboard-view">
      <h2 style={{ marginTop: '0' }}>🛡️ User Trust Dashboard & Secure Ledgers</h2>
      <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
        Isolated platform escrow hold entries tracking real-time arbitration settlement statuses[cite: 43, 58].
      </p>

      <div className="ledger-container">
        <table className="ledger-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Product Details</th>
              <th>Counterparty</th>
              <th>Escrow Amount</th>
              <th>Lease Settlement Status</th>
            </tr>
          </thead>
          <tbody>
            {clearLedgerData.map((row, index) => (
              <tr key={index}>
                <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{row.id}</td>
                <td>{row.details}</td>
                <td>{row.party}</td>
                <td style={{ fontWeight: '600' }}>{row.amount}</td>
                <td>
                  <span className={`status-badge ${row.class}`}>
                    {row.class === 'released' ? '✓ ' : '⚠️ '}{row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TrustDashboard;