# XIBIX Challenge

## Description

### Script to calulate viewspots based on a given mesh file.

## Usage

### Execute via serverless

```
$ serverless invoke local --function calculateViewSpots --data '{"fileNameWithAbsolutePath":"mesh-files/mesh_medium.json", "numberOfViewSpots": 5}'
```

### Execute via script

```
parameter one: MESH-file
parameter two: number of view spots

$ node bash.js mesh-files/mesh_medium.json 5
```


### Possible files

```
Small
mesh.json
```

```
10000 elements
mesh_medium.json
```

```
20000 elements
mesh_large.json
```