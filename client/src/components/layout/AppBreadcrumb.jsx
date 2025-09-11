import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import React from "react";
import { Link } from "react-router-dom";

export default function AppBreadcrumb({ locPath = [] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {locPath.map((path, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {index === locPath.length - 1 ? (
                <span>{path}</span>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={`/${locPath.slice(0, index + 1).join("/")}`}>
                    {path}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>

            {/* Add separator only if it's not the last item */}
            {index < locPath.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
