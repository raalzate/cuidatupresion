import { ReactNode } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export interface AppAlertProps extends React.ComponentProps<typeof Alert> {
  children: ReactNode;
  icon?: ReactNode;
  title: string;
  variant?: "default" | "destructive" | "info";
}

export const AppAlert: React.FC<AppAlertProps> = ({
  children,
  icon,
  title,
  variant = "default",
  ...props
}) => {
  return (
    <div className="flex-col">
      <div className="flex-1 px-8 pt-6">
        <div className="grid w-full items-start gap-4">
          <Alert variant={variant} {...props}>
            {icon}

            <AlertTitle>{title}</AlertTitle>

            <AlertDescription>{children}</AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};
