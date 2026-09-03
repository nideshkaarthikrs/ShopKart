function Home({ customer }) {
  return (
    <main className="home-page">
      <section className="profile-card">
        <p className="eyebrow">ShopKart</p>
        <h1>Welcome, {customer.fullName}!</h1>
        <p>Here is your customer information.</p>
        <div className="customer-details">
          <p><strong>Name</strong>{customer.fullName}</p>
          <p><strong>Email</strong>{customer.email}</p>
          <p><strong>Phone</strong>{customer.phone}</p>
        </div>
      </section>
    </main>
  )
}

export default Home
