//скрипт работает на JQuery

// загружает функцию слайдера, когда документ полностью готов
$(document).ready(function () {
  // этот метод запускает слайдер (внутри функции настройки слайдера)
  $(".carousel__inner").slick({
    // скорость в миллисекундах
    speed: 1200,
    // стилизация стрелок слайдера
    prevArrow:
      '<button type="button" class="slick-prev"><img src="icons/left.svg" alt="prev"></button>',
    nextArrow:
      '<button type="button" class="slick-next"><img src="icons/right.svg" alt="next"></button>',
    responsive: [
      {
        breakpoint: 992,
        settings: {
          dots: true,
          arrows: false,
        },
      },
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ],
  });

  // функция для работы табов
  // выбирает список табов
  $("ul.catalog__tabs").on(
    // при клике на элемент списка табов
    "click",
    // у которого нет класса active
    "li:not(.catalog__tab_active)",
    function () {
      // функция работает с табом, на который кликают в данный момент
      $(this)
        .addClass("catalog__tab_active")
        // метод перебирает все остальные элементы списка
        .siblings()
        // и удаляет класс active, если он есть
        .removeClass("catalog__tab_active")
        // переходит к ближайшему блоку, который является родителем и табам и панелям с контентом
        .closest("div.container")
        // находит коллекцию панелей с контентом
        .find("div.catalog__content")
        // удаляет у всех класс active
        .removeClass("catalog__content_active")
        // получает индекс таба, на который кликнули
        .eq($(this).index())
        // добавляет панели с контентом с соответствующим индексом класс active
        .addClass("catalog__content_active");
    }
  );

  // функция для переключения на панель с описанием
  function toggleSlide(item) {
    // выбирает элементы по классу и перебирает все по порядку
    $(item).each(function (i) {
      // работает со ссылкой, на которую сейчас кликают
      $(this).on("click", function (e) {
        // отменяет действия браузера по умолчанию (при нажатии на ссылку с # внутри)
        e.preventDefault();
        // добавляет или удаляет класс active
        $(".catalog-item__content")
          .eq(i)
          .toggleClass("catalog-item__content_active");
        $(".catalog-item__list").eq(i).toggleClass("catalog-item__list_active");
      });
    });
  }
  toggleSlide(".catalog-item__link");
  toggleSlide(".catalog-item__back");

  // скрипт для модальных окон
  // делает выборку элементов по атрибуту и создает функцию на их клик
  $('[data-modal="consultation"]').on("click", function () {
    // выбранные элементы появляются с заданной скоростью
    $(".overlay, #consultation").fadeIn("slow");
  });
  // выбирает блок закрытия модального окна и создает функцию на его клик
  $(".modal__close").on("click", function () {
    // выбранные элементы исчезают с заданной скоростью
    $(".overlay, #consultation, #order, #thanks").fadeOut("slow");
  });
  // делает выборку элементов по атрибуту и создает функцию: для каждого элемента в выборке по порядку
  $(".button_mini").each(function (i) {
    // при клике на конкретный элемент
    $(this).on("click", function () {
      // в модальное окно подтягивается соответствующее содержимое из указанного элемента с соответствующим номером
      $("#order .modal__descr").text($(".catalog-item__subtitle").eq(i).text());
      // выбранные элементы появляются с заданной скоростью
      $(".overlay, #order").fadeIn("slow");
    });
  });
  // JQuery validation plugin настройки
  function validateForms(form) {
    $(form).validate({
      rules: {
        name: "required",
        phone: "required",
        email: {
          required: true,
          email: true,
        },
      },
      messages: {
        name: "Пожалуйста, введите свое имя",
        phone: "Пожалуйста, введите свой номер телефона",
        email: {
          required: "Пожалуйста, введите свою почту",
          email: "Неправильно введен адрес почты",
        },
      },
    });
  }
  validateForms("#consultation-form");
  validateForms("#consultation form");
  validateForms("#order form");
  // скрипт для маски ввода телефонного номера
  $("input[name=phone]").mask("+7 (999) 999-99-99");

  // настройки плагина для отправки почты
  // выбираем все элементы с тегом form и создаем функцию на действие submit
  $("form").submit(function (e) {
    // отменяем стандартное поведение браузера при данном действии
    e.preventDefault();
    // создаем запрос типа ajax (без перезагрузки сайта)
    $.ajax({
      // тип запроса
      type: "POST",
      // адрес файла-обработчика
      url: "mailer/smart.php",
      // выборка данных для отправки (из текущей формы) и указание метода для их обработки
      data: $(this).serialize(),
      // создаем действие после достижения результата запроса
    }).done(function () {
      // выбираем текущую форму, находим поля ввода данных и очищаем их
      $(this).find("input").val("");
      // закрываются модальные окна с формами
      $("#consultation, #order").fadeOut();
      // открывается модальное окно с благодарностью
      $(".overlay, #thanks").fadeIn("slow");
      // все формы должны обновиться (очиститься)
      $("form").trigger("reset");
    });
    return false;
  });

  // скрипт стрелки для прокрутки страницы вверх
  $(window).scroll(function () {
    if ($(this).scrollTop() > 1600) {
      $(".pageup").fadeIn();
    } else {
      $(".pageup").fadeOut();
    }
  });
  // выбираются ссылки, и назначается функция на клик
  $("a[href=#up]").click(function () {
    // в переменную записывается значение атрибута href
    const _href = $(this).attr("href");
    // для всей страницы создается анимация с плавной прокруткой
    $("html, body").animate({ scrollTop: $(_href).offset().top + "px" });
    return false;
  });
});
