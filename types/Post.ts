import { User } from './User';

export type Post = {
    _id: any;
    title: string;
    body: string;
    image: string | null;
    postedBy: User;
};
