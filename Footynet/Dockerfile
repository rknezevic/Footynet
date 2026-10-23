# Build context: the Footynet/ solution folder
#   docker build -t footynet-api .

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Restore first so the dependency layer is cached between builds
COPY Footynet.sln ./
COPY Footynet/Footynet.WebApi.csproj Footynet/
COPY Footynet.Data/Footynet.Data.csproj Footynet.Data/
COPY Footynet.Model/Footynet.Model.csproj Footynet.Model/
COPY Footynet.Repository/Footynet.Repository.csproj Footynet.Repository/
COPY Footynet.Service/Footynet.Service.csproj Footynet.Service/
RUN dotnet restore Footynet/Footynet.WebApi.csproj

COPY . .
RUN dotnet publish Footynet/Footynet.WebApi.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Configuration comes from environment variables, e.g.
#   ConnectionStrings__DefaultConnection, Jwt__Key, Mapbox__AccessToken,
#   AdminSeed__Email, AdminSeed__Password, Cors__AllowedOrigins__0
ENV ASPNETCORE_ENVIRONMENT=Production
# W^X (write-xor-execute) memory protection crashes .NET with exit code 139 (SIGSEGV) on some
# sandboxed container hosts; Microsoft's documented workaround is to turn it off
ENV DOTNET_EnableWriteXorExecute=0
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

USER app
ENTRYPOINT ["dotnet", "Footynet.WebApi.dll"]
