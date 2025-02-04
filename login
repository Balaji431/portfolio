import React from 'react';

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-violet-900 text-white font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 bg-violet-800 shadow-md">
        <h1 className="text-3xl font-bold">Balaji D</h1>
        <div className="space-x-6">
          <a href="#home" className="hover:text-violet-400">Home</a>
          <a href="#about" className="hover:text-violet-400">About</a>
          <a href="#skills" className="hover:text-violet-400">Skills</a>
          <a href="#projects" className="hover:text-violet-400">Projects</a>
          <a href="#contact" className="hover:text-violet-400">Contact</a>
        </div>
      </nav>

      {/* Home Section */}
      <section id="home" className="flex flex-col items-center justify-center h-screen bg-violet-900 text-center">
        <h2 className="text-5xl font-extrabold mb-4">Hi, I'm Balaji D</h2>
        <p className="text-xl">Full-Stack Web Developer | AI Enthusiast</p>
      </section>

      {/* About Section */}
      <section id="about" className="p-10 bg-violet-800 rounded-2xl shadow-lg m-4">
        <h2 className="text-4xl font-bold mb-4">About Me</h2>
        <p>
          Passionate about creating dynamic, responsive websites and exploring the world of artificial intelligence. I love building projects that make a difference.
        </p>
      </section>

      {/* Skills Section */}
      <section id="skills" className="p-10 bg-violet-900 text-center">
        <h2 className="text-4xl font-bold mb-4">Skills</h2>
        <div className="flex justify-center space-x-4">
          <span className="bg-violet-700 px-4 py-2 rounded-full shadow-md">HTML</span>
          <span className="bg-violet-700 px-4 py-2 rounded-full shadow-md">CSS</span>
          <span className="bg-violet-700 px-4 py-2 rounded-full shadow-md">JavaScript</span>
          <span className="bg-violet-700 px-4 py-2 rounded-full shadow-md">React</span>
          <span className="bg-violet-700 px-4 py-2 rounded-full shadow-md">Node.js</span>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="p-10 bg-violet-800 rounded-2xl shadow-lg m-4">
        <h2 className="text-4xl font-bold mb-4">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-violet-700 p-4 rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold">Project 1</h3>
            <p>A web app that solves real-world problems.</p>
          </div>
          <div className="bg-violet-700 p-4 rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold">Project 2</h3>
            <p>An AI-based application to automate tasks.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="p-10 bg-violet-900 text-center">
        <h2 className="text-4xl font-bold mb-4">Contact Me</h2>
        <p>Email: <a href="mailto:dasettisribalu@gmail.com" className="text-violet-400 hover:underline">dasettisribalu@gmail.com</a></p>
      </section>

      {/* Footer */}
      <footer className="bg-violet-800 text-center p-4">
        <p>© 2025 Balaji D. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Portfolio;
