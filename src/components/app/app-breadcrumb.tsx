"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";
import { capitalize } from "@/lib/formats";

export default function AppBreadcrumb() {
  const pathname = usePathname();
  const pathnameList = pathname.split("/").slice(1);
  const lastPathname = pathnameList[pathnameList.length - 1];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathname === "/" ? (
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        ) : (
          pathnameList.map((path) => (
            <Fragment key={path}>
              <BreadcrumbItem>
                <BreadcrumbPage>{capitalize(path)}</BreadcrumbPage>
              </BreadcrumbItem>
              {path !== lastPathname && (
                <BreadcrumbSeparator className="hidden md:block" />
              )}
            </Fragment>
          ))
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
