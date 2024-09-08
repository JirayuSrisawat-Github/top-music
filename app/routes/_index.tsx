import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, Link, useLoaderData } from "@remix-run/react";
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

export const loader: LoaderFunction = async () => {
  const response = await fetch("https://api.jirayu.net/lavalink/track");
  const data = await response.json();

  return json(data);
};

export default function Index() {
  const data: Data[] = useLoaderData();
  console.log(data);

  return (
    <div className="container py-12 px-12 mx-auto">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row justify-between">
        <div className="flex flex-col">
          <h1 className="font-bold">Top Music&#39;s Chart</h1>
          <p className="text-xs md:text-sm text-white/50">
            เพลงที่มีคนฟังมากที่สุดบนบอท Murphy#9654, Asta#0160 และ Chompu#7744
          </p>
        </div>

        <div className="flex flex-row items-center space-x-2">
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

      <div className="grid grid-cols-1 md:grid-cols-4 abs gap-4">
        {data.slice(0,48).map((item) => (
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
                {item.title.length > 30
                  ? item.title.slice(0, 30) + "..."
                  : item.title}
              </Link>
              <p className="text-white/50 text-xs">
                มีการเล่นซ้ำจำนวน {item.count} ครั้ง
              </p>
            </div>
          </div>
        ))}
      </div>
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
