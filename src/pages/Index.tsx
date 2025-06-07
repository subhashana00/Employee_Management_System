import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  UserCog,
  Users,
  Clock,
  DollarSign,
  CalendarDays,
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sleek Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm px-6 h-16 flex items-center justify-between border-b">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold">
            BB
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Bistro Boardroom
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link to="/login" className="flex items-center gap-1">
              Sign In
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main>
        {/* Hero Section with Gradient Background */}
        <section className="relative py-16 md:py-28 lg:py-36 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-primary/5 to-background" />
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-6xl/none">
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Restaurant Staff
                  </span>{" "}
                  <br />
                  Management Simplified
                </h1>
                <p className="max-w-[600px] text-lg text-muted-foreground">
                  Bistro Boardroom streamlines employee scheduling, time
                  tracking, and payroll management for restaurant owners and
                  staff.
                </p>
                <div className="flex flex-col gap-3 min-[400px]:flex-row pt-2">
                  <Button size="lg" asChild className="rounded-full">
                    <Link to="/login" className="flex items-center gap-2">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="rounded-full"
                  >
                    <Link to="/signup">Create Account</Link>
                  </Button>
                </div>
              </div>

              {/* Demo Cards - Modern Glass Morphism Style */}
              <div className="flex items-center justify-center">
                <div className="w-full max-w-md rounded-xl border border-primary/10 bg-card/50 p-6 shadow-lg backdrop-blur-md">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold">Demo Accounts</h3>
                      <p className="text-sm text-muted-foreground">
                        Experience Bistro Boardroom instantly
                      </p>
                    </div>
                    <div className="grid gap-4">
                      <div className="rounded-lg border border-primary/10 bg-card p-4 transition-all hover:shadow-md">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserCog className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-base font-medium">
                              Admin Account
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              admin@bistro.com
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button
                            variant="secondary"
                            className="w-full rounded-full"
                            asChild
                          >
                            <Link to="/login">Login as Admin</Link>
                          </Button>
                        </div>
                      </div>
                      <div className="rounded-lg border border-primary/10 bg-card p-4 transition-all hover:shadow-md">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-base font-medium">
                              Employee Account
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              employee@bistro.com
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button
                            variant="secondary"
                            className="w-full rounded-full"
                            asChild
                          >
                            <Link to="/login">Login as Employee</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section with Clean Cards */}
        <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-muted/20 to-background">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary">
                Features
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Streamline Your Restaurant Operations
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our all-in-one platform helps restaurant owners and staff manage
                schedules, track time, and streamline payroll.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: <CalendarDays className="h-6 w-6" />,
                  title: "Easy Scheduling",
                  description: "Create and manage employee schedules with ease",
                },
                {
                  icon: <Clock className="h-6 w-6" />,
                  title: "Time Tracking",
                  description: "Track employee hours and overtime accurately",
                },
                {
                  icon: <DollarSign className="h-6 w-6" />,
                  title: "Payroll Management",
                  description: "Simplify payroll calculations and processing",
                },
                {
                  icon: <Users className="h-6 w-6" />,
                  title: "Employee Portal",
                  description:
                    "Give employees access to their schedules and timesheets",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group rounded-xl border border-primary/10 bg-card p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 transition-all group-hover:bg-primary/20">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t py-8 md:py-12">
        <div className="container flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold">
              BB
            </div>
            <p className="text-sm font-medium">Bistro Boardroom</p>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
