import { GET, POST, Path } from 'typescript-rest';

@Path('/utils')
export class UtilsController {

    /**
     * Health check endpoint
     * @returns {{status: string}}
     */
    @Path('/healthCheck')
    @GET
    healthCheck(): { status: string } {
        return { status: 'OK' }
    }

    /**
     * Ping pong endpoint (send "{message: 'ping'}" to receive "{ message: 'pong' }" )
     * @param {{message: string}} data
     * @returns {{message: string}}
     */
    @Path('/pingPong')
    @POST
    pingPong(data: { message: string }): { message: string } {
        return (data.message === 'ping') ? { message: 'pong' } : { message: 'Wrong input' }
    }

}
