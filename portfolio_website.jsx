import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export default function Portfolio() {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    fetch("https://api.github.com/users/trijeetbhandula/repos")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data
          .filter((repo) => !repo.fork && repo.description)
          .slice(0, 6);
        setRepos(filtered);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Trijeet Bhandula</h1>
        <p className="text-lg">Frontend Developer | React | TypeScript | AWS Certified</p>
        <p className="text-sm text-gray-600">Sydney, Australia</p>
        <div className="flex justify-center mt-4 gap-4">
          <a href="https://github.com/trijeetbhandula" target="_blank">
            <Button variant="outline"><Github className="mr-2" /> GitHub</Button>
          </a>
          <a href="https://linkedin.com/in/trijeet-bhandula" target="_blank">
            <Button variant="outline">LinkedIn</Button>
          </a>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-center">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repos.map((repo) => (
            <Card key={repo.id} className="hover:shadow-lg">
              <CardContent className="p-4">
                <h3 className="text-xl font-bold mb-2">{repo.name}</h3>
                <p className="text-sm mb-4 text-gray-700">{repo.description}</p>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View on GitHub
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="text-center text-gray-500 mt-16 text-sm">
        © 2025 Trijeet Bhandula. Built with React + Tailwind.
      </footer>
    </div>
  );
}
