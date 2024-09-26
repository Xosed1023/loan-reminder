import React from "react";
import { IonContent, IonPage, IonButton } from "@ionic/react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "./Onboarding.css";
import { useHistory } from "react-router";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

const Onboarding: React.FC = () => {
  const navigate = useHistory();

  return (
    <IonPage>
      <IonContent>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={50}
          slidesPerView={1}
          pagination={{ clickable: true, dynamicBullets: true }}
          scrollbar={{ draggable: true }}
        >
          <SwiperSlide>
            <div className="slide">
              <h1 className="title">Bienvenido a Loan Reminder</h1>
              <p>Una app que te ayuda a <strong>recordar</strong> quién tiene deudas contigo.</p>
              <div className="logo-container">
                <img className="logo" src="./logo.png" alt="Logo" />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide">
              <h1 className="title">Anota cada uno de tus préstamos</h1>
              <p>Pulsa el botón del <span className="plus-icon">+</span> para agregar un nuevo préstamo.</p>
              <div className="logo-container">
                <img
                  className="onboarding-img"
                  src="./onboarding/add_loan.png"
                  alt="Logo"
                />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide">
              <h1 className="title">
                Marca cada préstamo como cancelado o bórralo.
              </h1>
              <p>
                Desliza hacia la izquierda y pulsa el botón <span className="green-span">verde</span> para marcarlo
                como pago o pulsa el botón <span className="red-span">rojo</span> para borrarlo.
              </p>
              <div className="logo-container">
                <img
                  className="onboarding-img"
                  src="./onboarding/pay_delete.png"
                  alt="Logo"
                />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide">
              <h1 className="title">
                Actualiza la información de cada préstamo.
              </h1>
              <p>
                Desliza hacia la derecha y pulsa el botón <span className="blue-span">azul</span> para
                actualizarlo.
              </p>
              <div className="logo-container">
                <img
                  className="onboarding-img"
                  src="./onboarding/edit.png"
                  alt="Logo"
                />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide">
              <h1 className="title">
                ¿Necesitas ver los detalles de un préstamo?
              </h1>
              <p>Toca cualquier registro para <strong>ampliar</strong> los detalles.</p>
              <div className="logo-container">
                <img
                  className="onboarding-img"
                  src="./onboarding/details.png"
                  alt="Logo"
                />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide">
              <h1 className="title">Ordena y filtra tus préstamos</h1>
              <p>
                Cuando tengas los préstamos <strong>suficientes</strong> registrados, podrás
                <strong> ordenarlos</strong> y <strong>filtrarlos</strong>.
              </p>
              <div className="logo-container">
                <img
                  className="onboarding-img"
                  src="./onboarding/sorting.png"
                  alt="Logo"
                />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide">
              <h1 className="title">¡Todo listo!</h1>
              <IonButton
                className="onboarding-button"
                shape="round"
                expand="block"
                onClick={() => {
                  localStorage.setItem("hasSeenOnboarding", "true");
                  navigate.push("/home");
                }}
              >
                Comenzar
              </IonButton>
            </div>
          </SwiperSlide>
        </Swiper>

        {/* <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          onSwiper={(swiper) => console.log(swiper)}
          onSlideChange={() => console.log("slide change")}
        >
          <SwiperSlide>Slide 1</SwiperSlide>
          <SwiperSlide>Slide 2</SwiperSlide>
          <SwiperSlide>Slide 3</SwiperSlide>
          <SwiperSlide>Slide 4</SwiperSlide>
        </Swiper> */}
      </IonContent>
    </IonPage>
  );
};

export default Onboarding;
