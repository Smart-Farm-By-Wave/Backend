# Backend
This is the backend part of the Smart Farm By Wave project

# Set up
To set up, follow the these instruction step-by-step
1. Pull this directory to wherever you want.
2. Create a config.env file including
```
PORT =
NODE_ENV=
DATABASE=
DATABASE_PASSWORD=
```
```
Set the port to whatever port you want  
NODE_ENV is for debugging in developments, leaving it as "development" is fine.  
DATABASE is your mongo database connection link, changing the password part of the URL to <PASSWORD>  
DATABASE_PASSWORD is your mongoDB connection password  
```
3. Install all the dependencies via command
```
npm install
```
4. Run SetupAndDebugs.js to Create all the necessary database collections and document. The required function to start is already enabled, but if it's somehow not working or you tried to use other debug functions in the file, the functions needed to start are
```
generateFields() --> generate the 4 fields collections
createTimeSeries() --> generate the time series databases
genTree() --> generate the example trees, add more if you want
```

# Starting Server
Simply use
```
npm start
```
