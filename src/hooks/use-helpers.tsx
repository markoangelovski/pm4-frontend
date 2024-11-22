import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useUpdateQueryParam = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const updateQueryParam = (param: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (newParams.has(param)) {
      newParams.set(param, value);
    } else {
      newParams.append(param, value);
    }
    router.push(`${pathName}?${newParams.toString()}`);
  };

  return updateQueryParam;
};
