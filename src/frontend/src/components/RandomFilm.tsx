"use client";

const RandomFilm = () => {
  const PosterCard = () => (
    <div
      className="
        border bg-background
        relative overflow-hidden
        grid grid-cols-12
        rounded-lg
        p-5 md:p-8
        "
    >
      <div className="col-span-full flex flex-col md:flex-row xl:flex-col justify-between gap-3">
        <div className="md:max-w-xs shrink w-fit xl:max-w-none">
          {/** the movie poster needs to come here */}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative z-10 w-full bg-alternative border-b max-w-none mb-16 md:mb-12 xl:mb-0">
      <div className="max-w-7xl px-5 mx-auto py-8 sm:pb-16 sm:pt-12 xl:pt-16 flex flex-col xl:flex-row justify-between gap-12 xl:gap-12">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center w-full max-w-xl xl:max-w-[33rem]">
          {/** we could also blur the poster and use it as backgroud here */}
          {/**
           * Something we need to be careful with is that the movie object could not
           * have a poster we need to show something maybe an icon
           */}
          <div className="flex flex-col">
            <h1 className="m-0 mb-3 text-2xl sm:text-3xl text-foreground">
              {/** The movie name comes here */}
            </h1>
            <p className="m-0 text-foreground-light">
              {/** the movie description comes here */}
              {/** and then any other informations necessary */}
            </p>
          </div>
        </div>
        <div className="w-full xl:max-w-[440px] -mb-40">
          <PosterCard />
        </div>
      </div>
    </div>
  );
};

export default RandomFilm;
