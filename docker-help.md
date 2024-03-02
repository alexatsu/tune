# Images
- These are the <none> images you can delete. To delete them all at once (if you are really sure about that)

docker image rm $(docker image ls -f 'dangling=true' -q)

# Nextjs + Server requests

- use container name to communicate between microservices, localhost does not work