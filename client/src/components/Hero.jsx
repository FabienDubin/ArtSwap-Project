import React, { useEffect } from "react";
import { Parallax } from "react-scroll-parallax";
import { Blurhash } from "react-blurhash";

//COMPONENENTS
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Hero = ({ getImageSample, imageSample, isLoading, setIsLoading }) => {
  //HOOK
  useEffect(() => {
    getImageSample();
  }, []);

  if (isLoading || !imageSample) {
    return <div>Loading...</div>;
  }
  if (imageSample.length > 0) {
    return (
      <div className="relative p-7 h-full w-full overflow-hidden flex flex-col items-center justify-center mt-10">
        {/* Blurhash Background */}
        <div className="absolute z-10 ">
          <h1 className="relative text-4xl md:text-6xl font-bold text-center p-5 bg-white/50 backdrop-blur-[2px] w-screen">
            Welcome to Art Swap
          </h1>
        </div>

        {/* Parallax Image Grid */}
        <div className="grid grid-cols-2">
          <Parallax speed={-10}>
            <Card className="relative w-[100px] h-[130px] md:w-[180px] md:h-[240px] bg-white rounded-2xl shadow-lg overflow-hidden -mr-4 md:-mr-8">
              <Blurhash
                hash={imageSample[0].blur_hash}
                width={400}
                height={300}
                resolutionX={32}
                resolutionY={32}
                punch={1}
                className="absolute inset-0 w-full h-full object-cover blur-md"
              />
              <img
                src={`${imageSample[0].photo_image_url}?q=30&format=auto`}
                alt={imageSample[0].ai_description}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setIsLoading(false)}
              />
            </Card>
          </Parallax>
          <Parallax speed={15}>
            <Card className="relative w-[100px] h-[130px] md:w-[180px] md:h-[240px] bg-white rounded-2xl shadow-lg overflow-hidden mt-10 -mr-4 md:-ml-8">
              <Blurhash
                hash={imageSample[1].blur_hash}
                width={400}
                height={300}
                resolutionX={32}
                resolutionY={32}
                punch={1}
                className="absolute inset-0 w-full h-full object-cover blur-md"
              />
              <img
                src={`${imageSample[1].photo_image_url}?q=30&format=auto`}
                alt={imageSample[1].ai_description}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setIsLoading(false)}
              />
            </Card>
          </Parallax>

          <Parallax speed={-15}>
            <Card className="relative w-[100px] h-[130px] md:w-[180px] md:h-[240px] bg-white rounded-2xl shadow-lg overflow-hidden -mr-4 md:-mr-8">
              <Blurhash
                hash={imageSample[2].blur_hash}
                width={400}
                height={300}
                resolutionX={32}
                resolutionY={32}
                punch={1}
                className="absolute inset-0 w-full h-full object-cover blur-md"
              />
              <img
                src={`${imageSample[2].photo_image_url}?q=30&format=auto`}
                alt={imageSample[2].ai_description}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setIsLoading(false)}
              />
            </Card>
          </Parallax>
          <Parallax speed={10}>
            <Card className="relative w-[100px] h-[130px] md:w-[180px] md:h-[240px] bg-white rounded-2xl shadow-lg overflow-hidden -mr-4 md:-ml-8">
              <Blurhash
                hash={imageSample[3].blur_hash}
                width={400}
                height={300}
                resolutionX={32}
                resolutionY={32}
                punch={1}
                className="absolute inset-0 w-full h-full object-cover blur-md"
              />
              <img
                src={`${imageSample[3].photo_image_url}?q=30&format=auto`}
                alt={imageSample[3].ai_description}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setIsLoading(false)}
              />
            </Card>
          </Parallax>
        </div>
      </div>
    );
  }
};

export default Hero;
