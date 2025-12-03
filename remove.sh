for k in $(git branch --merged | sed /\*/d | egrep -v "(^\*|main|staging)" ); do
  if [ ! -z "$(git log $k -1 --since='2 weeks ago' -s)" ]; then
    git branch -D $k
  fi
done
