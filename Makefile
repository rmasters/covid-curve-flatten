IMAGE=rmasters/covid-curve-flatten
TAG?=latest
NAMESPACE=covidcurves

image:
	docker build -t "$(IMAGE):$(TAG)" .

push: image
	docker push "$(IMAGE):$(TAG)"

serve: image
	docker run --rm -it -p 8000:8000 "$(IMAGE):$(TAG)"

deploy:
	kubectl create ns "$(NAMESPACE)" || true
	kubectl apply -n "$(NAMESPACE)" -f deployment/
