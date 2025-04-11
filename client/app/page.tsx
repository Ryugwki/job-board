import Link from "next/link";
import React from "react";
import Header from "@/Components/Header";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import {
  Briefcase,
  Users,
  Building,
  SearchIcon,
  CheckCircleIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import Footer from "@/Components/Footer";

const features = [
  {
    icons: <Briefcase className="w-6 h-6 text-[#2f42c2]" />,
    title: "Find Your Dream Job",
    description:
      "Explore a wide range of job opportunities tailored to your skills and interests.",
    benefits: [
      "100,000+ job listings",
      "Remote and on-site options",
      "Daily job alerts",
      "Personalized job recommendations",
    ],
    cta: "Explore Jobs",
    ctaLink: "/findwork",
  },
  {
    icons: <Users className="w-6 h-6 text-[#2f42c2]" />,
    title: "Talent Pool",
    description:
      "Employers can access a diverse pool of qualified cadidatesfor their open positions.",
    benefits: [
      "1M+ registered users",
      "Advanced search filters",
      "Resume database access",
      "Candidate matching algorithms",
    ],
    cta: "Post a job",
    ctaLink: "/post",
  },
  {
    icons: <Building className="w-6 h-6 text-[#2f42c2]" />,
    title: "Top Companies Hiring",
    description:
      "Connect with leading companies actively seeking talent in your field.",
    benefits: [
      "500+ verified employers",
      "Company reviews and ratings",
      "Exclusive company insights",
      "Direct application process",
    ],
    cta: "View Companies",
    ctaLink: "/findwork",
  },
];

export default function page() {
  return (
    <main>
      <Header />
      <section className="py-20 bg-gradient-to-b from-[#d7dedc] to-[#2f42c2]/5 text-primary-foreground">
        <div className="container mx-auto px-4 text-center text-black">
          <h1 className="text-4xl text-[#2f42c2] md:text-5xl font-bold mb-6">
            Job board
          </h1>
          <p className="text-1xl mb-8"></p>
          <div className="max-w-2xl mx-auto flex gap-4">
            <Input
              type="text"
              placeholder="Search for jobs"
              className="flex-grow bg-white text-black"
            />
            <Button className="bg-[#2f42c2] text-white">
              <SearchIcon className="w-6 h-6" />
              Search Jobs
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f0f5fa]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center font-bold mb-12">
            Why Choose {""}
            <span className="text-[#2f42c2] font-extrabold"> Job Board</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="flex flex-col h-full rounded-xl border-none"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 items-center flex justify-center mb-2">
                    {feature.icons}
                  </div>
                  <CardTitle className="text-xl mb-2">
                    {feature.title}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link
                      href={feature.ctaLink}
                      className="bg-[#2f42c2] text-white rounded-md py-2 px-4 text-center w-full"
                    >
                      {feature.cta}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        <div className="mt-12 text-center">
          <Badge
            variant={"outline"}
            className="text-sm font-medium border-gray-400"
          >
            Trusted by 10,000+ companies worldwide
          </Badge>
        </div>
      </section>
      <section className="py-[7rem] bg-[#d7dedc]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Join Our Community</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <Button size={"lg"} variant={"outline"} asChild>
              <Link href={"/findwork"}>Find work</Link>
            </Button>
            <Button size={"lg"} variant={"outline"} asChild>
              <Link href={"/post"}>Post a job</Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
