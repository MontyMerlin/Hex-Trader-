import responder

api = responder.API(enable_hsts=True)

user = "Merlin"

@api.route("/hex-trader")
async def home_page(req,resp):
	resp.content = api.template("hex_index.html")

if __name__ == '__main__':
    api.run()


