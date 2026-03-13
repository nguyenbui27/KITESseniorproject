import { Endpoint } from "../../../core/common/apiLink";
import { RequestService } from "../../utils/response";

class ConversationService {
    async getMyConversation(setLoading: Function) {
        setLoading(true);
        try {
            const response = await RequestService.get(Endpoint.Conversation.MyConversation);
            return response;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async sendMessage(data: any, setLoading: Function) {
        setLoading(true);
        try {
            const response = await RequestService.post(Endpoint.Conversation.SendMessage, data);
            return response;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async getChatLogById(id: string, setLoading: Function) {
        setLoading(true);
        try {
            const response = await RequestService.get(`${Endpoint.Conversation.ChatLog}/${id}`);
            return response;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async getConversationByReceiverId(id: string, setLoading: Function) {
        setLoading(true);
        try {
            const response = await RequestService.get(`${Endpoint.Conversation.GetConversation}/${id}`);
            return response;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
}

export default new ConversationService();
