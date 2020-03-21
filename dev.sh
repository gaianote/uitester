git add .
git commit -m "auto update ..."
git push

python3 setup.py sdist
python3 setup.py sdist upload
