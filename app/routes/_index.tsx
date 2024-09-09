import type {
  LoaderFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Await,
  defer,
  Link,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { Suspense } from "react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

export const meta: MetaFunction = () => {
  return [
    { title: "Top Music's Chart" },
    {
      name: "description",
      content: "เพลงที่มีคนฟังมากที่สุดบนบอท Murphy, Asta และ Chompu",
    },
  ];
};

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams;
  const limit = Number(query.get("limit") || 10);

  return defer({
    data: fetch(`https://api.jirayu.net/lavalink/track?limit=${limit}`).then(
      (it) => it.json()
    ),
  });
};

export default function Index() {
  const { data } = useLoaderData<{ data: Data[] }>();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="container py-12 px-12 mx-auto">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row justify-between">
        <div className="flex flex-col">
          <h1 className="font-bold">Top Music&#39;s Chart</h1>
          <p className="text-xs md:text-sm text-white/50">
            เพลงที่มีคนฟังมากที่สุดบนบอท Murphy#9654, Asta#0160 และ Chompu#7744
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button className="bg-primary" size={"sm"} asChild>
            <Link to="https://discord.com/oauth2/authorize?client_id=1085549382528667790&permissions=540388368&scope=applications.commands+bot">
              Murphy#9654
            </Link>
          </Button>
          <Button className="bg-secondary" size={"sm"} asChild>
            <Link to="https://discord.com/oauth2/authorize?client_id=1259476682730111097">
              Asta#0160
            </Link>
          </Button>
          <Button className="bg-pink-500" size={"sm"} asChild>
            <Link to="https://discord.com/oauth2/authorize?client_id=1010597992266465340">
              Chompu#7744
            </Link>
          </Button>
        </div>
      </div>

      <Separator className="my-6" />

      <Suspense
        fallback={
          <div className="space-y-2 items-center justify-center flex flex-col min-w-full min-h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary" />
            <p className="text-primary animate-pulse">กําลังโหลดข้อมูล</p>
          </div>
        }
      >
        <Await resolve={data}>
          {(data) => (
            <div className="grid grid-cols-1 md:grid-cols-4 abs gap-4">
              {data.map((item) => (
                <div
                  key={item.id}
                  className="w-full h-full p-4 rounded shadow relative overflow-hidden"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${
                        item.artworkUrl ??
                        "https://cdn.chompubot.work/images/discordserver.png"
                      })`,
                      opacity: 0.5,
                    }}
                  />

                  <div className="relative z-10">
                    <Link
                      className="font-bold text-sm transition underline hover:text-white/75"
                      to={item.uri}
                    >
                      {item.title.length > 25
                        ? item.title.slice(0, 25) + "..."
                        : item.title}
                    </Link>
                    <p className="text-white/50 text-xs">
                      มีการเล่นซ้ำจำนวน {item.count} ครั้ง
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Await>
      </Suspense>

      <Separator className="my-6" />

      <Button
        variant={"ghost"}
        className="underline"
        onClick={() =>
          setSearchParams(
            {
              limit: (Number(searchParams.get("limit") || 10) + 10).toString(),
            },
            { preventScrollReset: true }
          )
        }
      >
        ดูเพิ่มเติม
      </Button>
    </div>
  );
}

type Data = {
  count: number;
  createdAt: string;
  id: number;
  identifier: string;
  title: string;
  updatedAt: string;
  uri: string;
  artworkUrl: string;
};
