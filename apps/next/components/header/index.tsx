import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const Header = ({
  title,
  children,
  className,
  description,
}: {
  title: string;
  children?: React.ReactNode;
  className?: string;
  description?: string;
}) => {
  return (
    <Card>
      <CardContent
        className={cn("flex items-center justify-between gap-2", className)}
      >
        <CardTitle className="text-xl">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {children}
      </CardContent>
    </Card>
  );
};

export { Header };
