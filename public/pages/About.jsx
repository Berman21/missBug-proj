const {Outlet, NavLink} = ReactRouterDOM

export function About() {
  const navStyle = {
    backgroundColor: '#f0f0f0',
    display: 'flex',
    gap: '10px',
  }

  return (
    <section className="about">
      <h1>About bugs and us...</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas doloremque
        magnam porro perferendis eos fugit. Dolorum asperiores ducimus quisquam.
        Fugiat magnam dolores illum laboriosam, nostrum minima accusamus beatae
        dicta nemo!
      </p>
      <nav style={navStyle}>
        <NavLink to="/about/team">Team</NavLink>
        <NavLink to="/about/vision">Vision</NavLink>
      </nav>
      <section className="flex justify-center">
        <Outlet />
      </section>
    </section>
  )
}
