PGDMP  *                	    |            students    16.4    16.4                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            	           1262    41223    students    DATABASE     z   CREATE DATABASE students WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Thai_Thailand.874';
    DROP DATABASE students;
                postgres    false            �            1259    41224 
   curriculum    TABLE     �   CREATE TABLE public.curriculum (
    id character varying(6) NOT NULL,
    curr_name_th character varying(50),
    curr_name_en character varying(50),
    short_name_th character varying(20),
    short_name_en character varying(20)
);
    DROP TABLE public.curriculum;
       public         heap    postgres    false            �            1259    41227    prefix    TABLE     g   CREATE TABLE public.prefix (
    id character varying(3) NOT NULL,
    prefix character varying(10)
);
    DROP TABLE public.prefix;
       public         heap    postgres    false            �            1259    41230    section    TABLE     [   CREATE TABLE public.section (
    id character varying(3) NOT NULL,
    section integer
);
    DROP TABLE public.section;
       public         heap    postgres    false            �            1259    41233    student    TABLE     �  CREATE TABLE public.student (
    id character varying(13) NOT NULL,
    prefix_id character varying(3),
    first_name character varying(50),
    last_name character varying(50),
    date_of_birth date,
    sex "char",
    curriculum_id character varying(6),
    section_id character varying(3),
    previous_school character varying(50),
    address text,
    telephone character varying(20),
    email character varying(30),
    line_id character varying(20),
    status character varying(20)
);
    DROP TABLE public.student;
       public         heap    postgres    false            �            1259    41238    student_list    TABLE     �   CREATE TABLE public.student_list (
    id integer NOT NULL,
    student_id character varying(13),
    active_date date,
    status character varying(20)
);
     DROP TABLE public.student_list;
       public         heap    postgres    false            �            1259    41241    student_list_id_seq    SEQUENCE     �   CREATE SEQUENCE public.student_list_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.student_list_id_seq;
       public          postgres    false    219            
           0    0    student_list_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.student_list_id_seq OWNED BY public.student_list.id;
          public          postgres    false    220            `           2604    41242    student_list id    DEFAULT     r   ALTER TABLE ONLY public.student_list ALTER COLUMN id SET DEFAULT nextval('public.student_list_id_seq'::regclass);
 >   ALTER TABLE public.student_list ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    219            �          0    41224 
   curriculum 
   TABLE DATA           b   COPY public.curriculum (id, curr_name_th, curr_name_en, short_name_th, short_name_en) FROM stdin;
    public          postgres    false    215   S       �          0    41227    prefix 
   TABLE DATA           ,   COPY public.prefix (id, prefix) FROM stdin;
    public          postgres    false    216                      0    41230    section 
   TABLE DATA           .   COPY public.section (id, section) FROM stdin;
    public          postgres    false    217   D                  0    41233    student 
   TABLE DATA           �   COPY public.student (id, prefix_id, first_name, last_name, date_of_birth, sex, curriculum_id, section_id, previous_school, address, telephone, email, line_id, status) FROM stdin;
    public          postgres    false    218   m                  0    41238    student_list 
   TABLE DATA           K   COPY public.student_list (id, student_id, active_date, status) FROM stdin;
    public          postgres    false    219   g)                  0    0    student_list_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.student_list_id_seq', 279, true);
          public          postgres    false    220            b           2606    41244    curriculum curriculum_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.curriculum
    ADD CONSTRAINT curriculum_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.curriculum DROP CONSTRAINT curriculum_pkey;
       public            postgres    false    215            d           2606    41246    prefix prefix_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.prefix
    ADD CONSTRAINT prefix_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.prefix DROP CONSTRAINT prefix_pkey;
       public            postgres    false    216            f           2606    41248    section section_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.section
    ADD CONSTRAINT section_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.section DROP CONSTRAINT section_pkey;
       public            postgres    false    217            j           2606    41250    student_list student_list_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.student_list
    ADD CONSTRAINT student_list_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.student_list DROP CONSTRAINT student_list_pkey;
       public            postgres    false    219            h           2606    41252    student student_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.student DROP CONSTRAINT student_pkey;
       public            postgres    false    218            k           2606    41253    student curriculum_id_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.student
    ADD CONSTRAINT curriculum_id_id FOREIGN KEY (curriculum_id) REFERENCES public.curriculum(id) NOT VALID;
 B   ALTER TABLE ONLY public.student DROP CONSTRAINT curriculum_id_id;
       public          postgres    false    218    4706    215            l           2606    41258    student prefix_id_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.student
    ADD CONSTRAINT prefix_id_id FOREIGN KEY (prefix_id) REFERENCES public.prefix(id) NOT VALID;
 >   ALTER TABLE ONLY public.student DROP CONSTRAINT prefix_id_id;
       public          postgres    false    218    4708    216            m           2606    41263    student section_id_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.student
    ADD CONSTRAINT section_id_id FOREIGN KEY (section_id) REFERENCES public.section(id) NOT VALID;
 ?   ALTER TABLE ONLY public.student DROP CONSTRAINT section_id_id;
       public          postgres    false    4710    217    218            n           2606    41268    student_list student_id_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.student_list
    ADD CONSTRAINT student_id_id FOREIGN KEY (student_id) REFERENCES public.student(id) NOT VALID;
 D   ALTER TABLE ONLY public.student_list DROP CONSTRAINT student_id_id;
       public          postgres    false    4712    219    218            �   �   x�s
20�|������v�<���`�L0����Evl}�cՃ��Xf̄�\�陗�_��X����P��������^	4�����`5[9=C��A6r>ر���-`�E`�a�B�/|�cX�r�S������L��-(-I-R(N�L�KNE6
���9�+F��� �zc      �   .   x�00�|�c���h�
00B��Xf,
q��qqq m��             x�60�4�
60�4����� ��         �  x��ZKo#�^���������c���	���͈#����)���x�2�M�$�Q�q��o�S��N���=�&v�Y������W�UF*CU��0
6��&�ۤ?oқM�ڤ�M�ԧ=s�~�IO6��&M��&��DaW�]�0� x�ӏ?���$TAE���f�Z*n��&m�6n�zT�-MUij��x�I�q[}ql�m�	/�麣9*��� ��V%,�������Ng���y_�����-�+�
���Z�_@\�E��%���ujtr0+�=T���wTN��������gЄ~�?��B^��4��k�҃ӱ�8Z@��.Y1p�t�A�x�1X���M�c��?������M����t���m���P5Z���	]��>��������6����Fy��J�z܀�g$^��R�M ����<8Z�ҰT�p��gc���0*�d�D�|�%���v�k�U�)&B�)4@���z��+����q�+��c�0�j	��p�3�]Ƶ�1�Q(O_)�x��8��9`�1����6Řx`��n=/v�UEYe�N��<y��t�<&$c8�!���i������Ʉ� Ȓ}p�s,���	�17|����������g1j�:�Ն��DuJ�w̞u�Ǜ���.j��-��B�$� �%%�
���ɴ<��B1y�A%+�舊���{yԔ�ω�R�=�ե����j(�2zE���u��]������C(��G$�ɬ��=����pUP򁦭K�^W����k�'���dmJ)"�c3X�	4�9�{���<�˞��(�L��C���g"�F�����p�ȟ���[:iH��s�3E�8�lq�.7���2q�7����W ��.H�q�n �����^��
�, ����S��!�Ϲ������P{Ҏ�"�B�"tD��k ��~]^��D��[��ѿɕ/��� ��z|�ڈ%���x#��! %�k�#}�^�ΰc(v@�y�M}rB�Wy��7����ĨRr��coѫT�Ӊ���m�$����gІ��@E5�o���>\��	[N�_���)\EY6C�3��>*c�3�ꕶ��R�Sv>vsI��A~@���ɖ��L ܒ�����+�w6ƈ�")�Y��G�9y8�����X�~� /�j[M�'IM���l�p��J;r'e3c�-�gP]�<´��\�{`�\1��z��L���	C��Ȅ��фM;�z���[�K'�j�__T�������WU��ؖ !��J�
Q��ֽѐ���Ma���>�U��N����M��wt����O�[���Ͼ�>������񓯿y���W�}Y0P�$)�|�����J��t��]�b�n�����I����h�����H� g)��+����)sm��-��+ ���k�l08c�wNc@XFS	E�!����sF�I!9��=8��B&�1�}�5�pQ����/U��L8b�����<`ʼ�D�>c��̂���
F�'\϶H�ܘ���esX]:�uyڍDh�9�n�����h�$n��X�K���~4r���G<j����N�^�ެ����+:�kg�pK}��M����TJXn�0����݇p��d�)�Y�+��+~T�
J���mi�\x�햒��-}qm�ۅ
�Kje<��z.�h�Ç /�(��t⁃D�(I!���;7j��pc�|�݋��¿6C緶Kc�����āY[�H�7����R���D�sA��?�"|Wɼ��@Gх],�/Ԧ�.�oOn��oٱu-�vcܡI��Te�!wG2!bD��΁��t�޷���}����2ו�I�7�U������A.!ZK ���K��[P�aG4Yn��Q�E�D�;s���D�]^#�Fdm�IEʭ���Z���W�F�Ћ���U��8�?D1y�ٕI&���U��E\u��)��C�}h7�1-�ed����o��W�/s�8�p��Vd��N�{�א"nYmP�!^��n[.7;����z��8|�m<1C����:P���Y�t悇�+�ʷ{�'�=�v�w/)�a"[�,���]�&��(�(˛��mG�?�$O7�Qfo����Z]���E���\�_���U�=�=�eHb���@O�R~�sR���+�h٦Yny�&��	S��@,�@yy)cwZ>�:)�K@��eԵ�PK�i>��(	��53RK�P��d"��wGf|��)�[J�K3��=����>z�����         d  x���Kn$7D��]z�?Yw�a���Yzo�4`�}�>�kK)�e� �V|]�~��3���S�)�\n����n9��xy�{��z������������q��Z^F�X������Oh��� �	�-m�p�������2JO=�t�����	/3?>;��/����S�̬7��!5�?�b9���T�*A�T��k1Tm$��s�� џD�� N�����B��O����'����=�V%=��#
��$f�I�z+�
�Bu4!�-�.���"�)�J�h~���-���Bo%�=�ګh~�n�S��/�vk�G�y�B�����y>��\�.D�(X�-�`�B��ڭK����y�FvTKB��[5Ѽ�Ⱥj�y��h^Vdv�h^KD�&��Y�M4��S������+Ѽ�Ȏj�y+�gtѼ��\uѼ�Ȏ��yGE�!��Ѽ��n�pc���9��y$&y$y$�0D�D	�ɭ�ABnr�a����z$�&�	�ɭ�ABnr�a����z$�&�	�ɭ�!b�Mn=���0H���� !�[��hn=���0Hȩ�Bkwʩn=r�[��������T�	9խ�ABNu�a��S�z$�T�	�ɭ�AB4�	��z$Ds�a�ͭ�!�ͭ�AB4��S�ͭ�AB4�	��z$Ds�a�ͭ�AB4�	��z$Ds�a�8GB�u~g��'�Y�O�|��uJ"�O�a�Ԣ�����q�Srѧ�K.{c	}J.���%�~Z�\]*�şY�>�����% ��ld1����,k�&�&>%k�f9�}J�F��9��q��u�Q^�u�q^�љ�H�<��3��^KѺ4�k9Z��{�EO ��Z���1�y�׼F}mE���}툮^�����Q��__љ��/�UY"�4J�em��K��4kt�F�#�r�xFwJ�(x��P�P��j<�_&"���)j���NѸ�<��zid�[������Ș� �5�M�^��dn�|����M��[XHWwa��W�����"��'��)D��O�j7XM��U���-����_���'ˮ��i7X.k�v����<���,:Z_�,
Z;�,
Z��Vp^L�F�����垮�Y��|�΢�56�����3����Y��^n]����i��8w\�����(����u&����5$�����!���������u��K��q!�Ҙv^,ѥ	���ꬣ�֌�j=�x�j��dn^2&��Z���Y����L�؃�ǜ�L�Z<�GƧ�OƧ�WƧ�_Ƨ�gƧ�oƧ�wƧ�Ƨ��ƣJ�>��^��~����������������>��^���o�S�s�S�w�S�{�S��Sԃ�Sԇ�Sԋ�Sԏ�Sԓ�R��r|�zs|��s|�zt|��t|�zu|��u|�zv|��v|�zw\�R��OQ�OQ�OQ/�OQ?�Oa C�̥b �M���̄�Td>���F����0��
i�`!�M!.c��g�Liv�`JÅ`V����1���1��B:8^!�.�]!��p!�긅`�Å`ȳ+C��=.���Ka��R�@� F0b�!F0 bc"F0,��ybj���1�	#�#1�i#�)1��#�/1�)#�5�ӗ������     