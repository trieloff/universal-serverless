module.exports.main = async function(request, context) {
  return new Response("hello world", {
    status: 201
  });
}