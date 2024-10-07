import {
    ArgumentsHost,
    Catch,
    HttpException,
    HttpServer,
    HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';

export type ErrorCodesStatusMapping = {
    [key: string]: number;
};

/**
 * {@link PrismaClientExceptionFilter}
 * catches {@link Prisma.PrismaClientKnownRequestError}
 * and {@link Prisma.NotFoundError} exceptions.
 */
@Catch(Prisma?.PrismaClientKnownRequestError, Prisma?.NotFoundError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
    /**
     * default error codes mapping
     *
     * Error codes definition for Prisma Client (Query Engine)
     * @see https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine
     */
    private readonly errorCodesStatusMapping: ErrorCodesStatusMapping = {
        P2000: HttpStatus.BAD_REQUEST,
        P2002: HttpStatus.CONFLICT,
        P2025: HttpStatus.NOT_FOUND,
    };

    /**
     * @param applicationRef
     * @param errorCodesStatusMapping
     */
    public constructor(
        applicationRef?: HttpServer,
        errorCodesStatusMapping?: ErrorCodesStatusMapping,
    ) {
        super(applicationRef);

        if (errorCodesStatusMapping) {
            this.errorCodesStatusMapping = Object.assign(
                this.errorCodesStatusMapping,
                errorCodesStatusMapping,
            );
        }
    }

    /**
     * @param exception
     * @param host
     * @returns
     */
    public catch(
        exception: Prisma.PrismaClientKnownRequestError | Prisma.NotFoundError | Error,
        host: ArgumentsHost,
    ) {
        if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            return this.catchClientKnownRequestError(exception, host);
        }
        if (exception instanceof Prisma.NotFoundError) {
            return this.catchNotFoundError(exception, host);
        }
        // Handle other types of errors
        return super.catch(exception, host);
    }

    private catchClientKnownRequestError(
        exception: Prisma.PrismaClientKnownRequestError,
        host: ArgumentsHost,
    ) {
        const statusCode = this.errorCodesStatusMapping[exception.code];
        const message = `[${exception.code}]: ${this.exceptionShortMessage(exception.message)}`;

        if (!Object.keys(this.errorCodesStatusMapping).includes(exception.code)) {
            return super.catch(exception, host);
        }

        super.catch(new HttpException({ statusCode, message }, statusCode), host);
    }

    private catchNotFoundError(
        { message }: Prisma.NotFoundError,
        host: ArgumentsHost,
    ) {
        const statusCode = HttpStatus.NOT_FOUND;

        super.catch(new HttpException({ statusCode, message }, statusCode), host);
    }

    private exceptionShortMessage(message: string): string {
        const shortMessage = message.substring(message.indexOf('→'));

        return shortMessage
            .substring(shortMessage.indexOf('\n'))
            .replace(/\n/g, '')
            .trim();
    }
}