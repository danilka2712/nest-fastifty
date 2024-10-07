import { INestApplication } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ApplicationModule } from './modules/app.module';
import { CommonModule, LogInterceptor } from './modules/common';
import { PrismaClientExceptionFilter } from './modules/common/flow/prisma-client-exception.filter';

/**
 * Это настройки API по умолчанию, которые можно изменить с помощью переменных окружения,
 * изменять их не обязательно (смотрите файл `.env.example`)
 */
const API_DEFAULT_PORT = 3000;
const API_DEFAULT_PREFIX = '/api/v1/';

/**
 * Приведенные ниже значения по умолчанию предназначены для настройки Swagger, измените их
 * в соответствии с вашими потребностями (измените хотя бы заголовок и описание).
 *
 * @todo Измените приведенные ниже константы в соответствии с вашими требованиями к API
 */
const SWAGGER_TITLE = 'TSAUTO API';
const SWAGGER_DESCRIPTION = 'API для клиентов tsauto';
const SWAGGER_PREFIX = '/docs';

/**
 * Зарегистрировать модуль Swagger в приложении NestJS.
 * Этот метод изменяет данное "приложение", чтобы зарегистрировать новый модуль, предназначенный для
 * Документации Swagger API. Любой запрос, выполненный с помощью "SWAGGER_PREFIX", приведет к
 * в качестве ответа получите страницу документации.
 *
 * @todo Ознакомьтесь с документацией по пакету NPM `nestjs/swagger`, чтобы настроить
приведенный ниже код с помощью ключей API, требований безопасности, тегов и многого другого.
 */
function createSwagger(app: INestApplication) {
    const options = new DocumentBuilder()
        .setTitle(SWAGGER_TITLE)
        .setDescription(SWAGGER_DESCRIPTION)
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(SWAGGER_PREFIX, app, document);
}

/**
 * Создайте и загрузите NestJS API.
 * Этот метод является отправной точкой API; он регистрирует приложение
 * модуль и регистрирует важные компоненты, такие как регистратор и запрос
 * анализ промежуточного программного обеспечения.
 */
async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestFastifyApplication>(
        ApplicationModule,
        new FastifyAdapter()
    );

    // @todo Включите Helmet для улучшения заголовков безопасности API

    app.setGlobalPrefix(process.env.API_PREFIX || API_DEFAULT_PREFIX);


    /**  Установка глобального фильтра для обработки исключений Prisma
    Этот фильтр перехватывает ошибки, возникающие при взаимодействии с базой данных,
    и позволяет возвращать более информативные ответы клиенту.
    */

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

    if (!process.env.SWAGGER_ENABLE || process.env.SWAGGER_ENABLE === '1') {
        createSwagger(app);
    }

    const logInterceptor = app.select(CommonModule).get(LogInterceptor);
    app.useGlobalInterceptors(logInterceptor);

    await app.listen(process.env.API_PORT || API_DEFAULT_PORT);
}

/**
 * Теперь пришло время включить свет!
 * Любая серьезная ошибка, которая не может быть обработана NestJS, будет зафиксирована в коде
 * ниже. По умолчанию ошибка отображается в стандартном режиме вывода и завершается.
 *
 * @todo Часто рекомендуется дополнить приведенный ниже код функцией перехвата исключений
 * сервис для лучшей обработки ошибок в производственных средах.
 */

bootstrap().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);

    const defaultExitCode = 1;
    process.exit(defaultExitCode);
});
