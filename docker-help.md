# Images
- These are the <none> images you can delete. To delete them all at once (if you are really sure about that)
  
```
docker image rm $(docker image ls -f 'dangling=true' -q)
```

# Volumes
- Delete hanging volumes
```
docker volume rm $(docker volume ls -f 'dangling=true' -q)
```

# Docker hub
- pushing images to hub
  
```
docker tag <imageId> <username>/<repo>:<tag>
docker push <username>/<repo>:<tag>
```

# Nextjs + Server requests

- use container name to communicate between microservices, localhost does not work

