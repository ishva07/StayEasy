import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";

export const createCityService = async (name: string,cityImage:string |undefined) => {
  const cityExist = await prisma.city.findFirst({ where: {name}  });
  if (cityExist) throw new ApiError(409, "City already exist with same name");

  const newCity = await prisma.city.create({ data:{name,images:cityImage} });
  return newCity;
};

export const editCityService = async (
  cityId: string,
  name:string,
  cityImage:string | undefined
) => {
  const city = await prisma.city.findFirst({ where: { id: cityId } });
  if (!city) throw new ApiError(404, "no city exist with this id");

  if (city.name === name && cityId != city.id)
    throw new ApiError(409, "City already exist with same name");

  const editedCity = await prisma.city.update({
    where: { id: cityId },
    data:{
        name,
    cityImage
    }
  });
  return editedCity;
};

export const deleteCityService = async (cityId: string) => {
  const city = await prisma.city.findUnique({ where: { id: cityId } });
  if (!city) throw new ApiError(404, "no city exist with this id");

  const deletedCity = await prisma.city.delete({
    where: { id: cityId },
  });
  return deletedCity;
};


export const getCityService = async () => {
  const city = await prisma.city.findMany();
  return city;
};