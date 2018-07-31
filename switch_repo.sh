# changing all project-name recordings in all files
new_repo=new_repo
new_project_name=new_project_name

mkdir 1
mkdir 1/src
mkdir 1/src/app
mkdir 1/src/app/main

mkdir 2
mkdir 2/src
mkdir 2/src/app
mkdir 2/src/app/main


for file_name in angular.json package.json src/app/main/main.component.html src/index.html; do
  sed "s/abracadabra/$new_project_name/g" < $file_name > "1/$file_name"
done

main_component=
sed "s/abracadabora_repo/$new_repo/g" < "1/src/app/main/main.component.html" > "2/src/app/main/main.component.html"

mv "2/src/app/main/main.component.html" "1/src/app/main/main.component.html"


for file_name in 1/angular.json 1/package.json 1/src/app/main/main.component.html 1/src/index.html; do
  old_file_name=$(echo $file_name | cut -c 3-)
  sed "s/abracadabra/$new_project_name/g" < $file_name > $old_file_name
done

rm -rf 1 2

# changing project folder name
# mv ../ngTemplate "../$new_project_name"

# changing git repositiory
# git remote remove origin
# git remote add origin $new_repo
# git add .
# git commit -m "project renamed to $new_project_name"
# git push --set-upstream origin master

# install all the dependencies
# npm i